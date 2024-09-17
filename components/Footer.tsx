export default function Footer() {
  return (
    <footer className="flex h-16 items-center justify-center px-6 text-center">
      <p className="text-gray text-sm font-medium capitalize">
        &copy; PT. Pharmacy Cone Group {new Date().getFullYear()}
      </p>
    </footer>
  );
}
