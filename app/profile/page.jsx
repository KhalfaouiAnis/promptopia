"use client";
import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyProfile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setMyPosts(data);
    };
    if (session?.user.email) {
      fetchPosts();
    }
  }, []);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${id?.toString()}`, {
          method: "DELETE",
        });
        setMyPosts(() => myPosts.filter((post) => post._id !== id));
      } catch (error) {}
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
