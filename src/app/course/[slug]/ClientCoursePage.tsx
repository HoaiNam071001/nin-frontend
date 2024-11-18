'use client';

import { useRouter } from 'next/navigation';

const CoursePage = ({ slug }) => {
    const router = useRouter();
  
  return (
    <div>
      <h1>Dynamic Route</h1>
      {slug}
      <button onClick={() => router.push('/')}>Go Home</button>
    </div>
  );
};

export default CoursePage;
