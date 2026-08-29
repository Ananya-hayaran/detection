import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SignalFusion from "./components/SignalFusion.jsx";

export default function App() {
  return (
    <main className="relative bg-[var(--bg-black)]">
      <Navbar />
      <Hero />
      <SignalFusion />
    </main>
  );
}
