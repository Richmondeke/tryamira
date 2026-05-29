import { redirect } from 'next/navigation';

export default function ChatIndexPage() {
  // Immediately redirect the root /dashboard/chat to the inbox tab
  redirect('/dashboard/chat/inbox');
}
