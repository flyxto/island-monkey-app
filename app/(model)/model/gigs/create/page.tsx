"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGig } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  tag: z.string().min(2, "Tag is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hourlyRateLkr: z.coerce.number().min(500, "Hourly rate must be at least 500 LKR"),
  durationHours: z.string().min(1, "Duration is required"),
  venueName: z.string().min(2, "Venue name is required"),
  highlightTitle: z.string().min(2, "Highlight title is required"),
  highlightSubtitle: z.string().min(2, "Highlight subtitle is required"),
  whatsIncluded: z.string().min(2, "Please provide at least one feature"),
  coverImageUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

export default function CreateGigPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tag: "",
      description: "",
      hourlyRateLkr: 0,
      durationHours: "1 Hour",
      venueName: "",
      highlightTitle: "",
      highlightSubtitle: "",
      whatsIncluded: "",
      coverImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const parsedValues = {
        ...values,
        whatsIncluded: values.whatsIncluded.split(",").map(i => i.trim()).filter(Boolean),
        coverImageUrl: values.coverImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
      };
      
      await createGig(parsedValues);
      router.push("/model/gigs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 pt-4 pb-12 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/model/gigs"
          className="w-10 h-10 rounded-full border border-im-border flex items-center justify-center text-im-muted hover:text-im-heading hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            Create New Gig
          </h1>
          <p className="text-im-muted text-sm mt-1">Fill out the details to offer a new service</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-im-border p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gig Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Basic Fashion Shoot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Fashion & Portfolio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what the client gets..." 
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="hourlyRateLkr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (LKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3 Hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Studio B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-im-border/50">
              <div className="col-span-full">
                <h3 className="font-semibold text-sm text-im-heading">Highlight Feature</h3>
                <p className="text-xs text-im-muted">A special callout feature displayed on the gig card</p>
              </div>
              <FormField
                control={form.control}
                name="highlightTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Studio Wardrobe" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="highlightSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2 outfit changes" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whatsIncluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's Included</FormLabel>
                  <FormControl>
                    <Input placeholder="Hair styling, Makeup, Raw files..." {...field} />
                  </FormControl>
                  <FormDescription>Separate multiple items with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-im-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/model/gigs")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-im-accent hover:bg-im-accent/90 text-white min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Gig
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
