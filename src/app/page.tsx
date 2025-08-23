export default function Home() {
  return (
    <div className="flex flex-col justify-between h-screen max-w-3xl mx-auto p-4 bg-blue-950">
      <div className="chat-messages-div">
        <h1 className="text-center text-3xl font-bold">Messages</h1>
        <div className="chat-messages">

        </div>
      </div>

      <div className="input-box-div mb-1 flex flex-col md:flex-row gap-2">
        <input type="text" className="p-2 border-white border-2 rounded-2xl flex-1" placeholder="Write your message here..."></input>
        <button className="bg-red-500 py-2 px-4 border-white border-2 rounded-2xl ml-1">Send</button>
      </div>
    </div>
  );
}
