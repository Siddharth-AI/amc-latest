import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main>
      <Section className="bg-background">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Category Not Found
            </h1>
            <p className="text-lg text-text-muted mb-8">
              The category you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/products">Browse All Categories</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

