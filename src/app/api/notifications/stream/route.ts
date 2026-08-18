import { NextRequest } from 'next/server';

// Global in-memory broadcast bus for instant multi-tab & cross-device notification streaming
type Client = {
  id: string;
  send: (data: string) => void;
};

let clients: Client[] = [];

export function emitServerNotification(notification: any) {
  const payload = `data: ${JSON.stringify(notification)}\n\n`;
  clients.forEach(c => {
    try {
      c.send(payload);
    } catch (e) {
      // Ignore closed connections
    }
  });
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let closeStream = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };

      // Initial heartbeat ping
      send(`: connected as ${clientId}\n\n`);

      const newClient: Client = { id: clientId, send };
      clients.push(newClient);

      closeStream = () => {
        clients = clients.filter(c => c.id !== clientId);
      };
    },
    cancel() {
      closeStream();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
