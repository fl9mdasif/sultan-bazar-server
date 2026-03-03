import { Star } from "lucide-react";

const reviews = [
    {
        stars: 5,
        text: "Sultan এর সরিষার তেলের গন্ধ একদম আসল। বাড়িতে সবাই পছন্দ করেছে।",
        name: "Fatema B.",
        location: "Dhaka",
        avatar: "👩",
    },
    {
        stars: 5,
        text: "বিরিয়ানি মশলা দিয়ে রান্না করলে হোটেলের মতো স্বাদ হয়! অসাধারণ প্রোডাক্ট।",
        name: "Karim H.",
        location: "Chittagong",
        avatar: "👨",
    },
    {
        stars: 4,
        text: "Packaging was very neat and delivery was fast. Will order again without hesitation.",
        name: "Nasrin A.",
        location: "Sylhet",
        avatar: "👩",
    },
    {
        stars: 5,
        text: "Chia seeds quality is excellent and the price is also very reasonable. Highly recommended!",
        name: "Rahman F.",
        location: "Rajshahi",
        avatar: "👨",
    },
    {
        stars: 5,
        text: "Isphahani চা এর আসল স্বাদ পাচ্ছি। অনেক ভালো লেগেছে। নিয়মিত কিনব।",
        name: "Sumaiya K.",
        location: "Kushtia",
        avatar: "👩",
    },
    {
        stars: 5,
        text: "Sultan বাজার থেকে প্রতি মাসে অর্ডার করি। কখনো হতাশ হইনি। ধন্যবাদ।",
        name: "Tariqul I.",
        location: "Barishal",
        avatar: "👨",
    },
];

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
    return (
        <div
            className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border shadow-sm"
            style={{ border: "1.5px solid #F0E6D3" }}
        >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i <= review.stars ? "#D4860A" : "none"}
                        stroke={i <= review.stars ? "#D4860A" : "#ccc"}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="font-bengali text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <span className="text-2xl">{review.avatar}</span>
                <div>
                    <p className="font-bold text-sm text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.location}</p>
                </div>
                <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#B5451B15", color: "#B5451B" }}
                >
                    Verified
                </span>
            </div>
        </div>
    );
}

export default function Reviews() {
    // Duplicate for infinite scroll effect
    const doubled = [...reviews, ...reviews];

    return (
        <section className="py-8 lg:py-12 overflow-hidden" style={{ background: "#FDF6EC" }}>
            <div className="container mx-auto px-4 lg:px-8 mb-10">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4860A" }}>
                        Testimonials
                    </p>
                    <h2 className="font-bengali text-3xl lg:text-4xl font-bold text-gray-900">
                        আমাদের <span style={{ color: "#B5451B" }}>সন্তুষ্ট গ্রাহকরা</span>
                    </h2>
                    <p className="text-gray-500 mt-2">Real feedback from real customers</p>
                </div>
            </div>

            {/* Auto-scrolling carousel */}
            <div className="relative">
                {/* Fade edges */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to right, #FDF6EC, transparent)" }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to left, #FDF6EC, transparent)" }}
                />

                <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
                    {doubled.map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
