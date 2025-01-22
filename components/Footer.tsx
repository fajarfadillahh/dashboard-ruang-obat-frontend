export default function Footer() {
  return (
    <footer className="flex h-16 items-center justify-center px-6 text-center">
      <p className="text-sm font-medium capitalize text-gray">
        &copy; Part of{" "}
        <span className="font-bold text-purple">Pharma Metrocity Group</span>{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
