import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles(files);

    console.log("Selected files:", files);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
    setSelectedFiles([]);
    setLoading(false);
  };

  return (
    <div className="chat-app">

      {/* Top Bar */}
      <header className="top-bar">

        <div className="brand">

          <div className="brand-icon">
            ✺
          </div>

          <span>
            Chat<span className="brand-highlight">DPT</span>
          </span>

        </div>

        <button
          onClick={newChat}
          className="new-chat-button"
          title="New chat"
        >
          +
        </button>

      </header>


      {/* Main Chat */}
      <main className="chat-main">

        {messages.length === 0 ? (

          /* Welcome Screen */
          <div className="empty-state">

            <div className="logo-symbol">
              ✺
            </div>

            <h1>
              Chat<span>DPT</span>
            </h1>

            <p>
              Search. Understand. Explore.
            </p>

            {/* Three Dot Animation */}
            <div className="wave-loader">
              <span />
              <span />
              <span />
            </div>

          </div>

        ) : (

          /* Chat */
          <div className="messages-container">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`message-row ${
                  message.role === "user"
                    ? "user-row"
                    : "assistant-row"
                }`}
              >

                {/* AI breathing dot */}
                {message.role === "assistant" && (
                  <div className="ai-dot">
                    <div />
                  </div>
                )}

                <div
                  className={`message-bubble ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >

                  {message.role === "assistant" ? (

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>

                  ) : (

                    message.content

                  )}

                </div>

              </div>

            ))}


            {/* Thinking */}
            {loading && (

              <div className="message-row assistant-row">

                <div className="ai-dot">
                  <div />
                </div>

                <div className="thinking-pill">

                  <span />
                  <span />
                  <span />

                  <span className="thinking-text">
                    Thinking...
                  </span>

                </div>

              </div>

            )}

            <div ref={chatEndRef} />

          </div>

        )}

      </main>


      {/* Input Area */}
      <div className="input-wrapper">

        <div className="input-glass">


          {/* Upload Button */}
          <label className="upload-button">

            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />

            <span className="upload-icon">
              ✦
            </span>

          </label>


          {/* Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            disabled={loading}
          />


          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="send-button"
          >
            ↑
          </button>

        </div>


        {/* Selected Files */}
        {selectedFiles.length > 0 && (

          <div className="file-list">

            {selectedFiles.map((file, index) => (

              <div
                key={index}
                className="file-chip"
              >

                <span>
                  {file.type.includes("pdf")
                    ? "📄"
                    : "🖼️"}
                </span>

                <span className="file-name">
                  {file.name}
                </span>

                <button
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default App;