"use server"

import { getSession } from "@/lib/getserverSession"

export const DeleteMessage = async () => {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ message: "Unauthorized - login first" }, { status: 401 })

        }

    } catch (error) {

    }
}