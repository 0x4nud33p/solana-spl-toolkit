import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCallback, useContext, useEffect, useState } from "react";
import { UrlContext } from "@/context/UrlContext";
import axios from "axios";
//@ts-ignore
import vaderSentiment from "vader-sentiment";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const AnalysisResults = () => {
  const [commentCount, setCommentCount] = useState<number>(0);
  const { url, videoId } = useContext(UrlContext)!;
  const [commentLoading, setCommentLoading] = useState(false);
  //@ts-ignore
  const [commentTextLoading, setCommentTextLoading] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<any>({ agree: 0, disagree: 0, neutral: 0 });
  const [comments, setComments] = useState<string[]>([]);
  const [monthlyComments, setMonthlyComments] = useState<number[]>(Array(12).fill(0));
  const navigate = useNavigate();

  // Fetch Comment Count
  const fetchCommentCount = async () => {
    try {
      setCommentLoading(true);
      const config = {
        part: "statistics",
        id: `${videoId}`,
        key: `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
      };
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: config,
      });
      if (!data) {
        toast.error("Error while retrieving data");
      }
      setCommentCount(data?.items[0]?.statistics.commentCount);
    } catch (error: any) {
      console.error(error);
      toast.error("Error while fetching comment stats", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Fetch Comment Texts
  const fetchCommentTextData = useCallback(async () => {
    try {
      setCommentTextLoading(true);

      const config = {
        part: "snippet",
        videoId: videoId,
        maxResults: 100,
        order: "time",
      };

      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
        params: {
          ...config,
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
        },
      });

      const fetchedComments = data?.items
        ?.map((comment: any) => ({
          text: comment?.snippet?.topLevelComment?.snippet?.textDisplay,
          date: comment?.snippet?.topLevelComment?.snippet?.publishedAt,
        }))
        .filter((comment: any) => comment.text && comment.date);

      setComments(fetchedComments || []);
      analyzeSentiment(fetchedComments);
      calculateMonthlyDistribution(fetchedComments);
    } catch (error) {
      console.error("Error while fetching comment text:", error);
      toast.error("Error while fetching comment text");
    } finally {
      setCommentTextLoading(false);
    }
  }, [videoId]);

  // Sentiment Analysis
  const analyzeSentiment = (comments: { text: string }[]) => {
    let agree = 0;
    let disagree = 0;
    let neutral = 0;

    comments.forEach((comment) => {
      const sentiment = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(comment.text);
      if (sentiment.compound > 0.1) {
        agree++;
      } else if (sentiment.compound < -0.1) {
        disagree++;
      } else {
        neutral++;
      }
    });

    setSentimentAnalysis({ agree, disagree, neutral });
  };

  // Calculate Monthly Distribution
  const calculateMonthlyDistribution = (comments: { date: string }[]) => {
    const monthlyCounts = Array(12).fill(0);
    comments.forEach((comment) => {
      const month = new Date(comment.date).getMonth();
      monthlyCounts[month]++;
    });
    setMonthlyComments(monthlyCounts);
  };

  useEffect(() => {
    if (!url) {
      navigate("/");
    }
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
                    <span>{((sentimentAnalysis.agree / comments.length) * 100).toFixed(1)}%</span>
                  </Label>
                  <Progress value={((sentimentAnalysis.agree / comments.length) * 100)} className="mt-1" />
                </div>
                <div>
                  <Label className="flex justify-between">
                    <span>Disagree</span>
                    <span>{((sentimentAnalysis.disagree / comments.length) * 100).toFixed(1)}%</span>
                  </Label>
                  <Progress value={((sentimentAnalysis.disagree / comments.length) * 100)} className="mt-1 bg-gray-600" />
                </div>
                <div>
                  <Label className="flex justify-between">
                    <span>Neutral</span>
                    <span>{((sentimentAnalysis.neutral / comments.length) * 100).toFixed(1)}%</span>
                  </Label>
                  <Progress value={((sentimentAnalysis.neutral / comments.length) * 100)} className="mt-1 bg-gray-600" />
                </div>
              </div>
            </div>

            {/* Total Comments */}
            <div>
              <h3 className="text-md font-bold mb-4">Total Comments</h3>
              <div className="space-y-2 text-center">
                <p className="text-5xl font-bold">
                  {commentLoading ? <span className="loader"></span> : commentCount}
                </p>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="text-xl font-bold">{sentimentAnalysis.agree}</p>
                    <p className="text-sm text-gray-400">Agree</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{sentimentAnalysis.disagree}</p>
                    <p className="text-sm text-gray-400">Disagree</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{sentimentAnalysis.neutral}</p>
                    <p className="text-sm text-gray-400">Neutral</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Comment Distribution Section */}
        <CardContent className="mt-8">
          <h3 className="text-md font-bold mb-4">Monthly Comment Distribution</h3>
          <div className="flex justify-center">
            <div className="w-full grid grid-cols-12 gap-2">
              {monthlyComments.map((count, index) => (
                <div key={index} className="text-center">
                  <div
                    className="bg-purple-500 mx-auto"
                    style={{ height: `${count}px`, width: "20px" }}
                  ></div>
                  <p className="mt-2 text-xs">
                    {new Date(0, index).toLocaleString("default", { month: "short" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Back to Input Button */}
        <CardContent className="mt-8 grid grid-cols-1 md:grid-cols-2 space-y-2 justify-items-center">
          <Link to={"/"}>
            <Button variant="secondary" className="bg-white">
              Back to Input
            </Button>
          </Link>
          <div>
            <p className="text-red-500 text-xs md:text-sm">Analysis is based upon the latest 100 comments</p>
            <p className="text-red-500 text-xs md:text-sm">Spam comments are not considered</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
