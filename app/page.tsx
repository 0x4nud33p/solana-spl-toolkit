"use client";

import Navbar from "@/components/navbar";
import { HomeDashboard } from "@/components/home-dashboard";
import { MintTokens } from "@/components/mint-tokens";
import { TransferTokens } from "@/components/transfer-tokens";
import { BurnCloseAccount } from "@/components/burn-close-account";
import { AuthorityManagement } from "@/components/authority-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="min-h-screen bg-black p-10">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="mint">Mint</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="burn">Burn</TabsTrigger>
          <TabsTrigger value="close">Close Account</TabsTrigger>
          {/* <TabsTrigger value="approve">Approve/Revoke</TabsTrigger>
          <TabsTrigger value="freeze">Freeze/Thaw</TabsTrigger>
          <TabsTrigger value="authority">Set Authority</TabsTrigger> */}
        </TabsList>

        <TabsContent value="home">
          <HomeDashboard />
        </TabsContent>

        <TabsContent value="mint">
          <MintTokens />
        </TabsContent>

        <TabsContent value="transfer">
          <TransferTokens />
        </TabsContent>

        <TabsContent value="burn">
          <BurnCloseAccount />
        </TabsContent>

        <TabsContent value="close">
          <BurnCloseAccount />
        </TabsContent>

        <TabsContent value="approve">
          <AuthorityManagement />
        </TabsContent>

        <TabsContent value="freeze">
          <AuthorityManagement />
        </TabsContent>

        <TabsContent value="authority">
          <AuthorityManagement />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
