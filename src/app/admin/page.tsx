import { redirect } from "next/navigation";

const page = () => {
  return redirect("/admin/posts");
};

export default page;
