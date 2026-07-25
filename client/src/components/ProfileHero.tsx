import { useEffect, useState } from "react";
import { getProfile, type Profile } from "../api";

export default function ProfileHero() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <section>
      <h1>{profile?.name}</h1>
      <h2>{profile?.title}</h2>
      <p>{profile?.bio}</p>
      <div>
        <a href={profile?.links?.linkedIn}>LinkedIn</a>
        <a href={profile?.links?.gitHub}>GitHub</a>
        <a href={`mailto:${profile?.links?.email}`}>Email</a>
      </div>
    </section>
  );
}
