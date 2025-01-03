export default function DeleteButton({ shortCode }: { shortCode: string }) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const res = await fetch(`/list?key=${shortCode}`, { method: "DELETE" });

      if (res.ok) {
        alert("Entry deleted successfully!");
        location.reload();
      } else {
        const errorMsg = await res.text();
        alert(`Failed to delete the entry: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("An unexpected error occurred.");
    }
  }

  return (
    <button class="btn btn-danger" onClick={handleDelete}>
      Delete
    </button>
  );
}