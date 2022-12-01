import { useSession } from "next-auth/react";

export default function Main() {
  const { data: sessionData } = useSession();
  return <div>{`Welcome ${sessionData?.user?.name}`}</div>;
}
