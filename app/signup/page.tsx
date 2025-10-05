import React from "react";
import { SignupForm } from "./SignupForm";

const page = () => {
    return (
        <section className="mt-16 flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto px-4 gap-10">
            {/* Left side - Event message */}
            <div className="md:w-1/2 bg-blue-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                    Join Our College Events!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Participate in exciting workshops, competitions, and seminars to
                    enhance your skills and meet fellow students.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Explore clubs, take part in cultural events, and showcase your talent.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    Sign up now to reserve your spot and stay updated on upcoming events!
                </p>
            </div>

            {/* Right side - Signup Form */}
            <div className="md:w-1/2 w-full">
                <SignupForm />
            </div>
        </section>
    );
};

export default page;


// import React from 'react'
// import { SignupForm } from './SignupForm'
// const page = () => {
//     return (
//         <section className="mt-24 flex justify-around w-full">
//             <div>
//                 <h3>this is sign in page</h3>
//                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque pariatur tempora blanditiis?</p>
//                 <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, et.</p>
//             </div>
//            <div className='w-full'> <SignupForm /></div>
//         </section>
//     )
// }

// export default page
