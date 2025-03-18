
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useRestaurant } from '@/hooks/use-restaurants';
import { useCreateReview } from '@/hooks/use-reviews';
import { useUserOrders } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader, Star, ChevronLeft, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const WriteReview = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id);
  const { data: orders, isLoading: ordersLoading } = useUserOrders(user?.id);
  const { mutate: createReview, isPending } = useCreateReview();
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Check if user has ordered from this restaurant
  const hasOrdered = orders?.some(order => 
    order.restaurant_id === id && order.status === 'delivered'
  );
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Generate preview URLs for selected images
  useEffect(() => {
    if (!selectedFiles.length) return;
    
    const newPreviewUrls = Array.from(selectedFiles).map(file => 
      URL.createObjectURL(file)
    );
    
    setPreviewUrls(newPreviewUrls);
    
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 3) {
        toast.error('You can upload a maximum of 3 images');
        return;
      }
      
      const validFiles = files.filter(file => {
        const isValid = file.type.startsWith('image/');
        if (!isValid) {
          toast.error(`${file.name} is not a valid image file`);
        }
        return isValid;
      });
      
      setSelectedFiles(validFiles);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (!selectedFiles.length) return [];
    
    const uploadPromises = selectedFiles.map(async (file) => {
      const fileName = `${user!.id}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `review_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('food_images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      const { data } = supabase.storage
        .from('food_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    if (!hasOrdered) {
      toast.error('You can only review restaurants you have ordered from');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload images if any
      const imageUrls = selectedFiles.length ? await uploadImages() : [];
      
      // Find the latest completed order from this restaurant
      const latestOrder = orders
        ?.filter(order => order.restaurant_id === id && order.status === 'delivered')
        .sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime())[0];
      
      createReview({
        user_id: user.id,
        restaurant_id: id,
        order_id: latestOrder?.id || '',
        rating,
        comment,
        images: imageUrls,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (restaurantLoading) {
    return (
      <div className="container-custom py-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-foodie-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          Restaurant not found
        </div>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate('/restaurants')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          className="mr-4" 
          onClick={() => navigate(`/restaurants/${id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Restaurant
        </Button>
        <h1 className="text-3xl font-bold">Write a Review</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
              <img 
                src={restaurant.featured_image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle>{restaurant.name}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {restaurant.cuisine_type.join(', ')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!hasOrdered && !ordersLoading ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
              <p className="text-amber-800">
                You can only review restaurants you have ordered from. Place an order first to leave a review.
              </p>
              <Button 
                className="mt-4 bg-foodie-red hover:bg-red-600"
                onClick={() => navigate(`/restaurants/${id}`)}
              >
                Order Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex items-center gap-4">
                  <RadioGroup 
                    value={rating.toString()} 
                    onValueChange={(value) => setRating(parseInt(value))}
                    className="flex gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center">
                        <RadioGroupItem 
                          value={value.toString()} 
                          id={`rating-${value}`} 
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`rating-${value}`}
                          className={`p-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            rating >= value ? 'text-yellow-400' : 'text-gray-400'
                          }`}
                        >
                          <Star className={`h-8 w-8 ${rating >= value ? 'fill-yellow-400' : ''}`} />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <span className="text-lg font-medium">{rating}/5</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea 
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this restaurant..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Add Photos (Optional)</Label>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: 3 - previewUrls.length }).map((_, index) => (
                    <div 
                      key={`empty-${index}`} 
                      className="aspect-square rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400"
                    >
                      <span className="text-2xl">+</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <Label 
                    htmlFor="images" 
                    className="cursor-pointer flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded"
                  >
                    <Upload className="h-4 w-4" />
                    Select Images
                  </Label>
                  <input 
                    type="file" 
                    id="images" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    max={3} 
                    onChange={handleFileChange} 
                    disabled={previewUrls.length >= 3}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                    Max 3 images
                  </span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-foodie-red hover:bg-red-600"
                disabled={isPending || isUploading || !hasOrdered}
              >
                {(isPending || isUploading) && (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isPending || isUploading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WriteReview;
