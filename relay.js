const WebSocket = require('ws');

// Render는 반드시 이 포트를 사용해야 외부 접속 가능
const PORT = process.env.PORT || 10000;

const server = new WebSocket.Server({ port: PORT }, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});

let pcSocket = null;

server.on('connection', (socket, req) => {
  const url = req.url;
  console.log(`🔌 New connection on ${url}`);

  // PC가 연결하는 경로
  if (url === '/frompc') {
    console.log("💻 PC connected");
    pcSocket = socket;

    socket.on('close', () => {
      console.log("💻 PC disconnected");
      pcSocket = null;
    });

  // 스마트폰 등 외부 클라이언트가 연결하는 경로
  } else if (url === '/fromclient') {
    console.log("📱 Client connected");

    socket.on('message', (msg) => {
      console.log("📥 Message from client:", msg);
      if (pcSocket && pcSocket.readyState === WebSocket.OPEN) {
        pcSocket.send(msg); // PC로 전달
        console.log("➡️ Relayed to PC");
      } else {
        console.log("⚠️ No PC connected. Dropping message.");
      }
    });

    socket.on('close', () => {
      console.log("📱 Client disconnected");
    });

  } else {
    console.log(`❌ Unknown path: ${url}`);
    socket.close();
  }
});
