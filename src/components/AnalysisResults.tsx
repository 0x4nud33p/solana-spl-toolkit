import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCallback, useContext, useEffect, useState } from "react";
import { UrlContext } from "@/context/UrlContext";
import axios from "axios";
import { toast } from "sonner";


const AnalysisResults = () => {
  const [commentCount, setCommentCount] = useState<number>(0);
  const { url, videoId } = useContext(UrlContext)!;
  const [commentLoading,setCommentLoading] = useState(false);
  const [commentTextLoading,setCommentTextLoading] = useState(false);
  const [comments,setComments] = useState<string[]>([]);
  // comments counts handler
  const fetchCommentCount = async () => {
    try {
      setCommentLoading(true);
      const config = {
        part : "statistics",
        id : `${videoId}`,
        key : `${import.meta.env.VITE_YOUTUBE_API_KEY}`
      }
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos`,{
        params : config
      })
      if(!data){
        toast.error("error while retreving data",res);
      }
      setCommentCount(data?.items[0]?.statistics.commentCount);
    } catch (error : any) {
      console.error(error);
      toast.error("error while fetching comment stats",error)
    }finally {
      setCommentLoading(false);
    }
  } 
  // commment text handler
  const fetchCommentTextData = useCallback(async () => {
    try {
        setCommentTextLoading(true);
        
        const config = {
            part: "snippet",
            videoId: videoId,
            maxResults: 100,
            order: "time"
        };
        
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: {
                ...config,
                key: import.meta.env.VITE_YOUTUBE_API_KEY,
            },
        });

        const fetchedComments = data?.items?.map((comment: any) => 
            comment?.snippet?.topLevelComment?.snippet?.textDisplay
        ).filter(Boolean);

        setComments(fetchedComments || []);
        console.log("length of the comments array",fetchedComments.length);
        console.log("Fetched Comments:", fetchedComments);
    } catch (error) {
        console.error("Error while fetching comment text:", error);
        toast.error("Error while fetching comment text");
    } finally {
        setCommentTextLoading(false);
    }
}, [videoId]);

useEffect(() => {
    if (videoId) {
        fetchCommentCount();
        fetchCommentTextData();
    }
}, [videoId]);

  return (
    <div className="min-h-screen font-Space-grotesk bg-black text-white p-8">
      <Card className="max-w-5xl mx-auto">
        {/* Sentiment Analysis Section */}
        <CardHeader className="pb-4">
          <h2 className="text-lg font-bold">Analysis Results</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sentiment Analysis */}
            <div>
              <h3 className="text-md font-bold mb-4">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div>
                  <Label className="flex justify-between">
                    <span>Agree</span>
                    <span>62.9%</span>
                  </Label>
                  <Progress value={62.9} className="mt-1" />
                </div>
                <div>
                  <Label className="flex justify-between">
                    <span>Disagree</span>
                    <span>17.1%</span>
                  </Label>
                  <Progress value={17.1} className="mt-1 bg-gray-600" />
                </div>
                <div>
                  <Label className="flex justify-between">
                    <span>Neutral</span>
                    <span>20.0%</span>
                  </Label>
                  <Progress value={20.0} className="mt-1 bg-gray-600" />
                </div>
              </div>
            </div>

            {/* Total Comments */}
            <div>
              <h3 className="text-md font-bold mb-4">Total Comments</h3>
              <div className="space-y-2 text-center">
                <p className="text-5xl font-bold">
                  {commentLoading ? (
                    <span className="loader"></span>
                  ) : (
                    commentCount
                  )} </p>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="text-xl font-bold">505</p>
                    <p className="text-sm text-gray-400">Agree</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">137</p>
                    <p className="text-sm text-gray-400">Disagree</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">161</p>
                    <p className="text-sm text-gray-400">Neutral</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Comment Distribution Section */}
        <CardContent className="mt-8">
          <h3 className="text-md font-bold mb-4">Comment Distribution</h3>
          <div className="flex justify-center">
            <div className="w-full">
              {/* Bar Chart */}
              <div className="grid grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "50px" }}></div>
                  <p className="mt-2 text-sm">Jan</p>
                </div>
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "10px" }}></div>
                  <p className="mt-2 text-sm">Feb</p>
                </div>
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "100px" }}></div>
                  <p className="mt-2 text-sm">Mar</p>
                </div>
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "20px" }}></div>
                  <p className="mt-2 text-sm">Apr</p>
                </div>
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "90px" }}></div>
                  <p className="mt-2 text-sm">May</p>
                </div>
                <div className="text-center">
                  <div className="h-32 bg-purple-500" style={{ height: "80px" }}></div>
                  <p className="mt-2 text-sm">Jun</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Back to Input Button */}
        <CardContent className="mt-8">
          <Button variant="secondary" className="bg-gray-700">
            Back to Input
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
