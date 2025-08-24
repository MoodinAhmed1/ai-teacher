export default function ChatBotMessage({ msg }: { msg: { sender: string, message: string } }) {
    let { sender, message } = msg
    return (
        <>
            {sender == "robot" && (
                <p className="px-4 py-2 bg-cyan-100 rounded-2xl text-black w-fit mb-4 text-l max-w-xl">{message}</p>
            )}

            {sender == "user" && (
                <div className="px-4 py-2 bg-cyan-100 rounded-2xl text-black w-fit mb-4 text-l max-w-xl">{message}</div>
            )}
        </>
    )
}