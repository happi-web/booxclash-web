export const fetchAllLessons = async () => {
  try {
    const token = localStorage.getItem("token"); // Assuming you need to pass a token
    const response = await fetch("http://localhost:4000/api/lessons", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token if required
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }

    const data = await response.json();
    return data; // Make sure the returned data is an array of lessons
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return []; // Return an empty array in case of an error
  }
};
