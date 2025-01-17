import { ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUrlContext } from "@/context/UrlContext";
import '../index.css'

function Home() {
  const { url, setUrl } = useUrlContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim() === "") {
      alert("Please enter a valid YouTube URL.");
      return;
    }
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
    </div>
  );
}

export default Home;
