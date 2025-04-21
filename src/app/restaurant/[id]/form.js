import Link from 'next/link';

export default function AddButton() {
  return (
    <Link href="https://docs.google.com/forms/d/1y_mRQa2ccI4Y7BLzLNOVj2D7SORDOttZkmmI2YYSsLw" target="_blank">
      <button style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Add
      </button>
    </Link>
  );
}