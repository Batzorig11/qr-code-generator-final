import Link from "next/link";

export default function Header() {
  return (
    <div className="flex gap-2">
      <Link href="/">QR Generator</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/donate">Donate</Link>
    </div>
  );
}
