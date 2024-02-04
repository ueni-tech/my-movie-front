import axios from "axios";

export default function handler(req, res) {
  axios(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({message: 'サーバーサイドでエラーが発生しました'});
    });
}