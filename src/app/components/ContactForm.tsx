"use client";

import submitContactForm from "@/lib/submit/submitContactForm";
import { ContactFormData, ContactFormState } from "@/lib/types/contactForm";
import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ContactForm() {
  const initialFormData: ContactFormData = {
    name: "",
    email: "",
    message: "",
  };
  const initialState: ContactFormState = {
    formData: initialFormData,
    errors: {},
    success: false,
  };
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-gradient-to-b from-white to-sky-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sky-900">Get In Touch</h2>
          <p className="text-sky-700 text-lg">
            Need service for your paraglider? Drop us a message and we'll get
            back to you soon.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-sky-100 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-sky-900">
                Send us a message
              </CardTitle>
              <CardDescription className="text-sky-700">
                We'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                {/* Success Message */}
                {state.success && (
                  <Alert variant="success">
                    <AlertDescription>
                      Thank you! Your message has been sent successfully. We'll
                      get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {/* General Error */}
                {state.errors.general && (
                  <Alert variant="error">
                    <AlertDescription>{state.errors.general}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your full name"
                    className={
                      state.errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : ""
                    }
                    defaultValue={state.formData.name}
                  />
                  {state.errors.name && (
                    <p className="text-sm text-red-600">{state.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    className={
                      state.errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : ""
                    }
                    defaultValue={state.formData.email}
                  />
                  {state.errors.email && (
                    <p className="text-sm text-red-600">{state.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us about your paraglider service needs..."
                    rows={5}
                    className={
                      state.errors.message
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : ""
                    }
                    defaultValue={state.formData.message}
                  />
                  {state.errors.message && (
                    <p className="text-sm text-red-600">
                      {state.errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
