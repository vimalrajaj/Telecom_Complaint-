import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import MainLayout from "@/layouts/MainLayout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import ComplaintList from "@/pages/Complaint/ComplaintList";
import ComplaintDetails from "@/pages/Complaint/ComplaintDetails";
import CreateComplaint from "@/pages/Complaint/CreateComplaint";
import EditComplaint from "@/pages/Complaint/EditComplaint";
import AssignmentList from "@/pages/Assignment/AssignmentList";
import AssignmentDetails from "@/pages/Assignment/AssignmentDetails";
import Profile from "@/pages/Profile/Profile";
import EditProfile from "@/pages/Profile/EditProfile";

function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <Component {...rest} />
    </MainLayout>
  );
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location === "/") {
      setLocation(isAuthenticated ? "/dashboard" : "/login");
    }
  }, [location, isAuthenticated, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      <Route path="/dashboard">
        {(params) => <ProtectedRoute component={Dashboard} params={params} />}
      </Route>

      <Route path="/complaints">
        {(params) => <ProtectedRoute component={ComplaintList} params={params} />}
      </Route>
      <Route path="/complaints/new">
        {(params) => <ProtectedRoute component={CreateComplaint} params={params} />}
      </Route>
      <Route path="/complaints/:id">
        {(params) => <ProtectedRoute component={ComplaintDetails} params={params} />}
      </Route>
      <Route path="/complaints/:id/edit">
        {(params) => <ProtectedRoute component={EditComplaint} params={params} />}
      </Route>

      <Route path="/assignments">
        {(params) => <ProtectedRoute component={AssignmentList} params={params} />}
      </Route>
      <Route path="/assignments/:id">
        {(params) => <ProtectedRoute component={AssignmentDetails} params={params} />}
      </Route>

      <Route path="/profile">
        {(params) => <ProtectedRoute component={Profile} params={params} />}
      </Route>
      <Route path="/profile/edit">
        {(params) => <ProtectedRoute component={EditProfile} params={params} />}
      </Route>

      <Route>
        {() => (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
            <p className="text-slate-600 mb-6">Page not found</p>
            <button
              onClick={() => setLocation("/")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Return Home
            </button>
          </div>
        )}
      </Route>
    </Switch>
  );
}
