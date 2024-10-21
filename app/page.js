import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <div>
      <h1>hello</h1>
      <Button>submit</Button>
      <UserButton/>
    </div>
  );
}
