import { ChangeEvent, FormEvent, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { UrlContext } from "@/context/UrlContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { url, setUrl, setVideoId} = useContext(UrlContext)!;
  const navigate = useNavigate();

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[\w-.~:?#@!$&'()*+,;=%]*)?$/i;
    return regex.test(url);
  };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  if (!isValidYouTubeUrl(url)) {
    toast.error("Please enter a valid YouTube URL.");
    return;
  }

  const ytVideoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(ytVideoIdRegex);

  const ytVideoId = match ? match[1] : null;

  if (!ytVideoId) {
    toast.error("Could not extract video ID from URL.");
    return;
  }

  setVideoId(ytVideoId);
  console.log(ytVideoId);
  navigate("/stats")
};


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="min-h-screen font-Space-grotesk bg-black flex items-center justify-center text-white">
      <Card className="w-full max-w-md bg-black rounded-lg shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-white font-semibold text-center border-gray-500">
            YouTube Comment Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Label htmlFor="youtube-url" className="text-white text-sm font-medium">
              Enter a YouTube video URL to analyze its comments
            </Label>
            <Input
              id="youtube-url"
              value={url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border border-gray-700 bg-gray-800 text-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
            />
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-300 font-medium rounded-lg py-2"
            >
              Analyze Comments
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

export default Home;
