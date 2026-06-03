import { Card, CardContent } from "@/components/ui/card";
import { legal } from "@/models/legal";

export default function Legal() {
    return (
        <main className="relative min-h-screen bg-main-foreground sm:bg-background">
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start">
                <Card className="w-full sm:my-8 sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <CardContent className="flex flex-col justify-center gap-10 py-2">
                        {legal.map((item) => (
                            <div
                                key={item.section}
                                className="flex flex-col gap-6"
                            >
                                <h1 className="text-xl font-semibold">
                                    {item.section}
                                </h1>

                                <div className="flex flex-col gap-2">
                                    {item.content.map(
                                        (paragraph, paragraphIndex) => (
                                            <p
                                                key={`${item.section}-${paragraphIndex}`}
                                                className="text-sm"
                                            >
                                                {paragraph.content.map(
                                                    (part, partIndex) => {
                                                        const key = `${item.section}-${paragraphIndex}-${partIndex}`;

                                                        if (
                                                            part.type === "link"
                                                        ) {
                                                            return (
                                                                <a
                                                                    key={key}
                                                                    href={
                                                                        part.href
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-medium underline underline-offset-4 hover:opacity-80"
                                                                >
                                                                    {part.text}
                                                                </a>
                                                            );
                                                        }

                                                        return (
                                                            <span key={key}>
                                                                {part.text}
                                                            </span>
                                                        );
                                                    },
                                                )}
                                            </p>
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
