"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React from "react";
import RoleGate from "../_components/RoleGate";
import { UserRole } from "@prisma/client";
import FormSuccess from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminOnlyServerAction } from "@/actions/adminOnlyServerAction";

const AdminPage = () => {
  const handleApiRoute = () => {
    fetch("/api/admin")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          toast.success("You are allowed access");
        } else {
          toast.error("You are not allowed access");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const handleServerAction = async () => {
    const res = await adminOnlyServerAction();
    if (res.success) {
      toast.success("You are allowed access");
    } else {
      toast.error("You are not allowed access");
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to view this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button
            onClick={() => {
              handleApiRoute();
            }}
          >
            Click to test
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button
            onClick={() => {
              handleServerAction();
            }}
          >
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
