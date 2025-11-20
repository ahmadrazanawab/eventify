"use client";

import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loder } from "@/app/components/Loder";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, QrCode, IndianRupee, ShieldCheck, AlertCircle, Megaphone } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Event = {
    _id: string;
    title: string;
    date: string;
    category: string;
    venue: string;
    description: string;
    paymentRequired?: boolean;
    fee?: number;
};

type Student = {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    year: string;
};

type RegistrationLite = { event?: { _id?: string } } & Record<string, unknown>;

type RzpResponseLike = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
};

type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: { name: string; email: string; contact: string };
    notes: { eventId: string; studentId: string };
    theme: { color: string };
    handler: (response: RzpResponseLike) => void;
    modal?: { ondismiss: () => void };
    [k: string]: unknown;
};

type RegistrationFormInputs = {
    eventFees?: number;
};

type RegistrationRecord = {
    _id: string;
    event?: { _id?: string };
    paymentStatus?: string;
    registeredAt?: string | number;
};

interface CreateEventResponse {
    success: boolean;
    message?: string;
}

type Announcement = {
    _id: string;
    title: string;
    message: string;
    audience: 'All' | 'Students' | 'Admins';
    priority: 'High' | 'Medium' | 'Low';
    publishAt?: string;
    createdAt: string;
};

export default function StudentEventsPage() {
    const useDummy = process.env.NEXT_PUBLIC_USE_DUMMY_PAYMENT === 'true';
    const [events, setEvents] = useState<Event[]>([]);
    const [student, setStudent] = useState<Student | null>(null);
    const [registeredRegs, setRegisteredRegs] = useState<RegistrationLite[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payNow, setPayNow] = useState(false);
    const [paying, setPaying] = useState(false);
    const [dummyOpen, setDummyOpen] = useState(false);
    const [dummyProcessing, setDummyProcessing] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState(""); // MM/YY
    const [cvv, setCvv] = useState("");
    const [dummyError, setDummyError] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);
    const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr' | 'cash'>('card');
    const [qrAck, setQrAck] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const { register, handleSubmit, reset } = useForm<RegistrationFormInputs>();
    const searchParams = useSearchParams();
    const deepLinked = useRef(false);

    // Helper: load Razorpay checkout script once
    const loadRzpScript = () =>
        new Promise<boolean>((resolve) => {
            const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
            if (existingScript) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    // Helper: begin Razorpay payment flow directly
    const beginRazorpayPayment = async (ev: Event, stu: Student) => {
        try {
            setPaying(true);
            const orderRes = await axios.post(
                "/api/payment/razorpay/order",
                { eventId: ev._id },
                { withCredentials: true }
            );
            if (!orderRes.data?.success) {
                setDummyOpen(true);
                setPaying(false);
                return;
            }
            const { order, key } = orderRes.data as { order: { amount: number; currency: string; id: string }; key: string };

            const ok = await loadRzpScript();
            if (!ok) {
                setDummyOpen(true);
                setPaying(false);
                return;
            }

            const options: RazorpayOptions = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: ev.title,
                description: "Event Registration Fee",
                order_id: order.id,
                prefill: { name: stu.name, email: stu.email, contact: stu.phone },
                notes: { eventId: ev._id, studentId: stu.id },
                theme: { color: "#0ea5e9" },
                handler: async (response: RzpResponseLike) => {
                    try {
                        const verifyRes = await axios.post(
                            "/api/payment/razorpay/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                eventId: ev._id,
                                name: stu.name,
                                email: stu.email,
                                phone: stu.phone,
                                department: stu.department,
                                year: stu.year,
                            },
                            { withCredentials: true }
                        );
                        if (verifyRes.data?.success) {
                            alert("Payment successful and registration completed!");
                            reset();
                            closeModal();
                            setRegistration(verifyRes.data.data);
                            setRegisteredRegs((prev) => [...prev, verifyRes.data.data]);
                            setSuccessOpen(true);
                        } else {
                            alert(verifyRes.data?.message || "Payment verification failed");
                        }
                    } catch (e) {
                        console.error(e);
                        alert("Payment verification failed");
                    } finally {
                        setPaying(false);
                    }
                },
                modal: { ondismiss: () => setPaying(false) },
            };

            const rzp = new (window as unknown as { Razorpay: new (opts: RazorpayOptions) => { open: () => void } }).Razorpay(options);
            rzp.open();
        } catch (e) {
            setDummyOpen(true);
            setPaying(false);
        }
    };

    const registerCash = async () => {
        if (!selectedEvent || !student) return;
        try {
            const res = await axios.post(
                "/api/student-register-event",
                {
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    department: student.department,
                    year: student.year,
                    event: selectedEvent._id,
                    eventFees: selectedEvent.fee ?? 0,
                    paymentStatus: "pending",
                    paymentMethod: "cash",
                },
                { withCredentials: true }
            );
            if (res.data?.success) {
                alert("Registered with cash. Awaiting admin confirmation.");
                reset();
                closeModal();
                setRegistration(res.data.data);
                setRegisteredRegs((prev) => [...prev, res.data.data]);
                setSuccessOpen(true);
            } else {
                alert(res.data?.message || "Failed to register cash payment");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to register cash payment");
        }
    };

    // Fetch events
    const getEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/create-event", { withCredentials: true });
            console.log("Events:", res.data?.data);
            setEvents(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch events error:", err);
            setLoading(false);
        }
    };

    // Fetch my registrations to disable already-registered events
    const getRegistrations = async () => {
        try {
            const res = await axios.get("/api/student-register-event", { withCredentials: true });
            setRegisteredRegs(res.data?.data || []);
        } catch (err) {
            console.error("Fetch registrations error:", err);
        }
    };

    const confirmDummyPayment = async () => {
        if (!selectedEvent || !student) return;
        try {
            setDummyProcessing(true);
            // If paying by Card, validate fields; for QR, require acknowledgment only
            if (paymentMethod === 'card') {
                // Validate minimal card fields in dummy mode
                const luhnCheck = (num: string) => {
                    let sum = 0; let shouldDouble = false;
                    for (let i = num.length - 1; i >= 0; i--) {
                        let digit = parseInt(num.charAt(i), 10);
                        if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
                        sum += digit; shouldDouble = !shouldDouble;
                    }
                    return (sum % 10) === 0;
                };
                const cleanCard = cardNumber.replace(/\s+/g, "");
                const cardValid = /^[0-9]{13,19}$/.test(cleanCard) && luhnCheck(cleanCard);
                const expMatch = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
                let expValid = false;
                if (expMatch) {
                    const mm = parseInt(expMatch[1], 10);
                    const yy = parseInt(expMatch[2], 10);
                    const now = new Date();
                    const year = 2000 + yy;
                    const expDate = new Date(year, mm, 0, 23, 59, 59);
                    expValid = expDate >= now;
                }
                const cvvValid = /^\d{3,4}$/.test(cvv);
                if (!cardName || !cardValid || !expValid || !cvvValid) {
                    setDummyError("Please enter valid payment details.");
                    setDummyProcessing(false);
                    return;
                }
            } else {
                if (!qrAck) {
                    setDummyError("Please confirm you have completed the QR payment.");
                    setDummyProcessing(false);
                    return;
                }
            }
            const res = await axios.post(
                "/api/student-register-event",
                {
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    department: student.department,
                    year: student.year,
                    event: selectedEvent._id,
                    eventFees: selectedEvent.fee ?? 0,
                    paymentStatus: "paid",
                    paymentMethod: "online",
                },
                { withCredentials: true }
            );
            if (res.data?.success) {
                alert("Payment successful (dummy) and registration completed!");
                setDummyOpen(false);
                setCardName(""); setCardNumber(""); setExpiry(""); setCvv(""); setDummyError("");
                reset();
                closeModal();
                setRegistration(res.data.data);
                setSuccessOpen(true);
            } else {
                alert(res.data?.message || "Failed to complete dummy payment");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to complete dummy payment");
        } finally {
            setDummyProcessing(false);
        }
    };

    // Fetch student
    const getStudent = async () => {
        try {
            const res = await axios.get("/api/student/me", { withCredentials: true });
            console.log("Student:", res.data.student);
            if (res.data.success) setStudent(res.data.student);
        } catch (err) {
            console.error("Fetch student error:", err);
        }
    };

    useEffect(() => {
        getEvents();
        getStudent();
        getRegistrations();
    }, []);

    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                const r = await fetch('/api/announcements?limit=5', { cache: 'no-store' });
                const d = await r.json();
                const items: Announcement[] = Array.isArray(d?.data) ? d.data : [];
                setAnnouncements(items.filter(a => a.audience === 'All' || a.audience === 'Students'));
            } catch {}
        };
        loadAnnouncements();
    }, []);

    // Deep-link: open modal/payment when arriving with ?eventId=...
    useEffect(() => {
        if (deepLinked.current) return;
        const id = searchParams.get("eventId");
        if (!id || events.length === 0) return; // wait for events

        const ev = events.find((e) => e._id === id);
        if (!ev) return;

        const expired = new Date(ev.date) < new Date();
        const already = registeredRegs?.some((r) => r?.event?._id === id);

        if (expired) {
            alert("This event has expired.");
            deepLinked.current = true;
            return;
        }
        if (already) {
            alert("You have already registered for this event.");
            deepLinked.current = true;
            return;
        }

        // If payment is required and we're not in dummy mode, ensure student is loaded before proceeding
        if (ev.paymentRequired && !useDummy && !student) {
            return; // wait for student; effect will rerun when student is available
        }

        setSelectedEvent(ev);
        setPayNow(!!ev.paymentRequired);
        setPaymentMethod('card');
        setQrAck(false);

        if (ev.paymentRequired) {
            if (useDummy) {
                setDummyOpen(true);
                deepLinked.current = true;
                return;
            }
            // Razorpay path
            beginRazorpayPayment(ev, student as Student);
            deepLinked.current = true;
            return;
        }

        // Free event: open standard registration modal
        setIsModalOpen(true);
        deepLinked.current = true;
    }, [events, registeredRegs, searchParams, student]);

    const openModal = (event: Event) => {
        // Block opening if already registered
        const already = registeredRegs?.some((r) => r?.event?._id === event._id);
        if (already) {
            alert("You have already registered for this event");
            return;
        }
        setSelectedEvent(event);
        // If dummy is enabled and event is paid, force payNow to true, else default to event requirement
        setPayNow(useDummy ? !!event.paymentRequired : !!event.paymentRequired);
        setPaymentMethod('card');
        setQrAck(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const onSubmit = async (data: RegistrationFormInputs) => {
        if (!selectedEvent || !student) return;

        try {
            // If event is paid and student chose to pay now, go through Razorpay
            if (selectedEvent.paymentRequired && payNow) {
                // Force dummy payment path if feature flag is enabled
                if (useDummy) {
                    setDummyOpen(true);
                    setPaying(false);
                    return;
                }
                setPaying(true);
                // 1) Create Razorpay order
                let orderData: { amount: number; currency: string; id: string } | null = null;
                let keyVal = "";
                try {
                    const orderRes = await axios.post(
                        "/api/payment/razorpay/order",
                        { eventId: selectedEvent._id },
                        { withCredentials: true }
                    );
                    if (!orderRes.data?.success) {
                        // Fallback to dummy payment
                        setDummyOpen(true);
                        setPaying(false);
                        return;
                    }
                    const { order, key } = orderRes.data as { order: { amount: number; currency: string; id: string }; key: string };
                    orderData = order;
                    keyVal = key;
                } catch (e) {
                    // Fallback to dummy payment on server/network error
                    setDummyOpen(true);
                    setPaying(false);
                    return;
                }

                // 2) Load Razorpay script
                const loadRazorpay = () =>
                    new Promise<boolean>((resolve) => {
                        const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
                        if (existingScript) return resolve(true);
                        const script = document.createElement("script");
                        script.src = "https://checkout.razorpay.com/v1/checkout.js";
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.body.appendChild(script);
                    });

                const ok = await loadRazorpay();
                if (!ok) {
                    // Fallback to dummy payment
                    setDummyOpen(true);
                    setPaying(false);
                    return;
                }

                if (!orderData || !keyVal) {
                    setDummyOpen(true);
                    setPaying(false);
                    return;
                }

                // 3) Open checkout
                const options: RazorpayOptions = {
                    key: keyVal,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: selectedEvent.title,
                    description: "Event Registration Fee",
                    order_id: orderData.id,
                    prefill: {
                        name: student.name,
                        email: student.email,
                        contact: student.phone,
                    },
                    notes: { eventId: selectedEvent._id, studentId: student.id },
                    theme: { color: "#0ea5e9" },
                    handler: async (response: RzpResponseLike) => {
                        try {
                            // 4) Verify payment and create registration as paid
                            const verifyRes = await axios.post(
                                "/api/payment/razorpay/verify",
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    eventId: selectedEvent._id,
                                    name: student.name,
                                    email: student.email,
                                    phone: student.phone,
                                    department: student.department,
                                    year: student.year,
                                },
                                { withCredentials: true }
                            );
                            if (verifyRes.data?.success) {
                                alert("Payment successful and registration completed!");
                                reset();
                                closeModal();
                                setRegistration(verifyRes.data.data);
                                setRegisteredRegs((prev) => [...prev, verifyRes.data.data]);
                                setSuccessOpen(true);
                            } else {
                                alert(verifyRes.data?.message || "Payment verification failed");
                            }
                        } catch (e) {
                            console.error(e);
                            alert("Payment verification failed");
                        } finally {
                            setPaying(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setPaying(false);
                        },
                    },
                };

                const rzp = new (window as unknown as { Razorpay: new (opts: RazorpayOptions) => { open: () => void } }).Razorpay(options);
                rzp.open();
                return; // stop default registration flow
            }

            // Free event or pay later: create registration with none/pending
            const res = await axios.post(
                "/api/student-register-event",
                {
                    ...data,
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    department: student.department,
                    year: student.year,
                    event: selectedEvent._id,
                    eventFees: selectedEvent.paymentRequired ? selectedEvent.fee : 0,
                    paymentStatus: selectedEvent.paymentRequired ? "pending" : "none",
                    paymentMethod: selectedEvent.paymentRequired ? "online" : "none",
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Successfully registered!");
                reset();
                closeModal();
                setRegistration(res.data.data);
                setRegisteredRegs((prev) => [...prev, res.data.data]);
                setSuccessOpen(true);
            } else {
                alert(res.data.message || "Registration failed");
            }
        } catch (error) {
            const err = error as AxiosError<CreateEventResponse>;
            console.error("Registration error:", err);
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <section className="w-full min-h-screen mt-24 p-4">
            <h1 className="text-3xl font-bold mb-6">Available Events</h1>

            {announcements.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Megaphone className="h-5 w-5"/> Announcements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {announcements.map(a => (
                            <Card key={a._id} className="border">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base leading-snug">{a.title}</CardTitle>
                                        <span className="rounded px-2 py-0.5 text-xs border">{a.priority}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">{a.audience} {a.publishAt ? `• ${new Date(a.publishAt).toLocaleString()}` : ''}</div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700">{a.message}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="flex w-[100vw] justify-center mt-20"><Loder /></div>
                ) : (
                    events.map((event) => {
                        const expired = new Date(event.date) < new Date();
                        const already = registeredRegs?.some((r) => r?.event?._id === event._id);
                        return (
                            <div key={event._id} className={`border p-4 rounded shadow ${expired ? 'bg-gray-50' : 'bg-emerald-50 border-emerald-200'}`}>
                                <h2 className={`text-xl font-semibold ${expired ? 'line-through text-gray-400' : ''}`}>{event.title}</h2>
                                <p className="text-gray-600">{event.date} | {event.category}</p>
                                <p className="text-gray-600">{event.venue}</p>
                                <p className="text-gray-700 mt-2">{event.description}</p>
                                {event.paymentRequired && (
                                    <p className="text-sm mt-2 font-medium">Fee: ₹{event.fee ?? 0}</p>
                                )}
                                {already ? (
                                    <Button className="mt-4 w-full" variant="outline" disabled>
                                        Registered
                                    </Button>
                                ) : expired ? (
                                    <Button className="mt-4 w-full" variant="outline" disabled>
                                        Expired
                                    </Button>
                                ) : (
                                    <Button className="mt-4 w-full" onClick={() => openModal(event)}>
                                        Register
                                    </Button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {isModalOpen && selectedEvent && student && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <button className="absolute top-2 right-2 text-lg font-bold" onClick={closeModal}>
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            Register for: {selectedEvent.title}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input value={student.name} readOnly />
                            <Input value={student.email} readOnly />
                            <Input value={student.phone} readOnly />
                            <Input value={student.department} readOnly />
                            <Input value={student.year} readOnly />
                            {selectedEvent.paymentRequired ? (
                                <div>
                                    <Label htmlFor="eventFees">Event Fee</Label>
                                    <Input
                                        id="eventFees"
                                        type="number"
                                        value={selectedEvent.fee ?? 0}
                                        readOnly
                                        {...register("eventFees")}
                                    />
                                    {!useDummy && (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                id="payNow"
                                                type="checkbox"
                                                checked={payNow}
                                                onChange={(e) => setPayNow(e.target.checked)}
                                            />
                                            <Label htmlFor="payNow">Pay now</Label>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="w-full" disabled={paying}>
                                    {paying ? "Processing..." : "Submit Registration"}
                                </Button>
                                {selectedEvent.paymentRequired && (
                                    <Button type="button" variant="outline" className="w-full" onClick={registerCash} disabled={paying}>
                                        Register Cash Payment
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {dummyOpen && selectedEvent && student && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-lg">
                        <Card className="w-full bg-white border border-gray-200 shadow-sm rounded-xl">
                            <button
                                className="absolute right-3 top-3 text-xl text-gray-500 hover:text-gray-700"
                                onClick={() => setDummyOpen(false)}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center justify-between text-gray-900">
                                    <span>Complete Payment</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-sm">
                                        <IndianRupee className="h-4 w-4" /> {selectedEvent.fee ?? 0}
                                    </span>
                                </CardTitle>
                                <div className="text-sm text-gray-500">{selectedEvent.title}</div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <Button type="button" variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => { setPaymentMethod('card'); setDummyError(''); }} className="flex items-center gap-2 rounded-md">
                                        <CreditCard className="h-4 w-4" /> Card
                                    </Button>
                                    <Button type="button" variant={paymentMethod === 'qr' ? 'default' : 'outline'} onClick={() => { setPaymentMethod('qr'); setDummyError(''); }} className="flex items-center gap-2 rounded-md">
                                        <QrCode className="h-4 w-4" /> QR
                                    </Button>
                                    <Button type="button" variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => { setPaymentMethod('cash'); setDummyError(''); }} className="flex items-center gap-2 rounded-md">
                                        <IndianRupee className="h-4 w-4" /> Cash
                                    </Button>
                                </div>

                                {paymentMethod === 'card' ? (
                                    <div className="space-y-3">
                                        <div>
                                            <Label htmlFor="cardName" className="text-gray-700">Name on card</Label>
                                            <Input id="cardName" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="cardNumber" className="text-gray-700">Card number</Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, "");
                                                    const grouped = raw.replace(/(.{4})/g, "$1 ").trim();
                                                    setCardNumber(grouped);
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <Label htmlFor="expiry" className="text-gray-700">Expiry (MM/YY)</Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={(e) => {
                                                        let v = e.target.value.replace(/[^0-9]/g, "");
                                                        if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                                        setExpiry(v.slice(0, 5));
                                                    }}
                                                />
                                            </div>
                                            <div className="w-28">
                                                <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                                                <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))} />
                                            </div>
                                        </div>
                                    </div>
                                ) : paymentMethod === 'qr' ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-md border bg-white p-3">
                                                <QRCode value={JSON.stringify({ type: 'upi-qr', eventId: selectedEvent._id, studentId: student.id, amount: selectedEvent.fee ?? 0, title: selectedEvent.title, ts: Date.now() })} size={160} />
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">Scan to pay (demo), then confirm below.</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input id="qrAck" type="checkbox" checked={qrAck} onChange={(e) => setQrAck(e.target.checked)} />
                                            <Label htmlFor="qrAck" className="text-gray-700">I have completed the QR payment</Label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600">Register as cash payment. Pay the amount at the counter. An admin will confirm your payment.</p>
                                        <Button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white" variant="outline" onClick={registerCash}>Register Cash Payment</Button>
                                    </div>
                                )}

                                {dummyError && (
                                    <div className="flex items-start gap-2 rounded-md bg-red-50 p-2 text-sm text-red-600">
                                        <AlertCircle className="mt-0.5 h-4 w-4" />
                                        <span>{dummyError}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Secure demo flow. No real payment processed.</span>
                                    </div>
                                    <span className="font-medium">₹{selectedEvent.fee ?? 0}</span>
                                </div>

                                <div className="flex gap-2">
                                    {paymentMethod === 'cash' ? (
                                        <div className="flex flex-col w-full gap-2">
                                            <Button className="w-full border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white" onClick={registerCash} disabled={dummyProcessing}>Register Cash</Button>
                                            <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setDummyOpen(false)} disabled={dummyProcessing}>
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex flex-col gap-2">
                                            <Button className="w-full border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white" onClick={confirmDummyPayment} disabled={dummyProcessing || (paymentMethod === 'qr' && !qrAck)}>
                                                {dummyProcessing ? "Processing..." : "Confirm Payment"}
                                            </Button>

                                            <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setDummyOpen(false)} disabled={dummyProcessing}>
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {successOpen && registration && selectedEvent && student && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-lg font-bold"
                            onClick={() => setSuccessOpen(false)}
                        >
                            &times;
                        </button>
                        <div className="text-center space-y-3">
                            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">✓</div>
                            <h2 className="text-2xl font-semibold">Registration Successful</h2>
                            <p className="text-sm text-muted-foreground">Your registration has been saved. Show this QR code at the venue.</p>
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-3">
                            <div className="p-3 border rounded-lg bg-white">
                                <QRCode
                                    value={JSON.stringify({
                                        rid: registration._id,
                                        eid: (registration.event && registration.event._id) || selectedEvent._id,
                                        sid: student.id,
                                    })}
                                    size={160}
                                />
                            </div>
                            <div className="w-full text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Reg ID</span><span className="font-medium">{registration._id}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{selectedEvent.title}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">₹{selectedEvent.fee ?? 0}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium capitalize">{registration.paymentStatus || (selectedEvent.paymentRequired ? 'paid' : 'none')}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(registration.registeredAt || Date.now()).toLocaleString()}</span></div>
                            </div>
                        </div>
                        <div className="mt-6 flex  gap-2">
                            <Button className="w-full" onClick={() => window.print()}>Print Receipt</Button>
                            <Button variant="outline" className="w-full" onClick={() => setSuccessOpen(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}





