import { useState } from "react";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    return (
        <div>
            <form>
                <input
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </form>
        </div>
    )
}