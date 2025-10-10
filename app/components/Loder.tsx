import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function Loder() {
    return (
        <div className="flex items-center gap-4 [--radius:1.2rem]">

            <Badge variant="outline">
                <Spinner />
                Loading
            </Badge>
        </div>
    )
}
