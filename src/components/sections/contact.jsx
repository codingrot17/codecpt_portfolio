import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactMessageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { contactService } from "@/lib/appwrite-service";

export default function Contact() {
  const sectionRef = useRef(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
        return await contactService.create(data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="section-padding overflow-hidden" ref={sectionRef}>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let's discuss your next project or collaboration opportunity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glassmorphism rounded-xl p-6 sm:p-8"
          >
            <h3 className="text-2xl font-semibold mb-6 text-blue-400">
              Send a Message
            </h3>

            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                <p className="text-gray-300">
                  Thank you for your message. I'll get back to you soon.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4"
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              {...field}
                              className="bg-primary-800/50 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              className="bg-primary-800/50 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Project inquiry, collaboration, etc."
                            {...field}
                            className="bg-primary-800/50 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell me about your project or what you'd like to discuss..."
                            className="bg-primary-800/50 border-gray-600 text-white min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 glow-effect"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="glassmorphism rounded-xl p-6 sm:p-8">
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">
                Let's Connect
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-400 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-300 break-words">codingrot001@gmail.com</p>
                    <p className="text-gray-300 break-words">
                      ademolaemmanuel645@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-purple-400 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-300 break-words">+234 (9) 033 747 946</p>
                    <p className="text-gray-300 break-words">+234 (8) 081 779 959</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-green-400 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-300">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-6">
                Available for Work
              </h3>
              <p className="text-gray-300 mb-4">
                I'm currently available for freelance projects and full-time
                opportunities. Let's create something amazing together!
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-green-400 font-semibold">
                  Available Now
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}