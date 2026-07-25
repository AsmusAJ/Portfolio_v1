export type Profile = {
  name: string;
  title: string;
  bio: string;
  links: {
    linkedIn: string;
    gitHub: string;
    email: string;
  };
};

export async function getProfile(): Promise<Profile> {
  const response = await fetch("http://localhost:5087/api/Profile");

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}
