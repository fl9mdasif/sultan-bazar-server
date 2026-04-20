"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { useAddReviewMutation } from "@/redux/api/productApi";
import { toast } from "sonner";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    orderId?: string;
    variantId?: string;
}

export function ReviewModal({ isOpen, onClose, productId, productName, orderId, variantId }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [addReview, { isLoading }] = useAddReviewMutation();

    const handleSubmit = async () => {
        // console.log("Submitting review...", { productId, rating, orderId, variantId });
        if (rating < 1 || rating > 5) {
            toast.error("Please select a rating between 1 and 5 stars.", { position: "top-right" });
            return;
        }

        try {
            // console.log("Calling addReview mutation...");
            const result = await addReview({
                productId,
                data: {
                    rating,
                    orderId: orderId || productId, // Fallback if needed
                    variantId: variantId
                }
            }).unwrap();

            // console.log("Review submitted successfully:", result);
            toast.success("Review submitted successfully!", { position: "top-right" });
            setRating(0); // Reset rating
            onClose(); // Close the modal
        } catch (error: any) {
            console.error("Failed to submit review:", error);
            toast.error(error?.data?.message || "Failed to submit review.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Rate Product</DialogTitle>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                    <p className="text-gray-600 text-center text-sm mb-2">
                        How many stars would you give <span className="font-semibold">{productName}</span>?
                    </p>

                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                        ? "fill-[#D4860A] text-[#D4860A]"
                                        : "fill-gray-100 text-gray-300"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <p className="text-xs text-gray-400 font-medium">Click to rate</p>
                </div>

                <div className="flex justify-end gap-3 w-full border-t border-gray-100 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isLoading} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isLoading}
                        className="bg-[#B5451B] hover:bg-[#9a3915] text-white rounded-xl min-w-[120px]"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
