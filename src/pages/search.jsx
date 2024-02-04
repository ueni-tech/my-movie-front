import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const search = () => {
  const router = useRouter();
  const {q: searchQuery} = router.query;

  useEffect(()=>{
    if(!searchQuery) return;
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`api/searchMedia?searchQuery=${searchQuery}`);
        console.log(response);
      } catch(err) {
        console.log(err);
      }
    }

    fetchMedia();
  }, [searchQuery])
  return (
    <div>search</div>
  )
}

export default search