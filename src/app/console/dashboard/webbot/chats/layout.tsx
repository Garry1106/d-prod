export default function ChatLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex h-screen bg-gray-50">
        {children}
      </div>
    );
  }