import MidSection from "@/components/MidSection";
import Header from "@/components/Navbar/Navbar";

export default async function Home() {
  return (
    <div className="h-screen">
      <Header />
      <MidSection />
    </div>
  );
}
