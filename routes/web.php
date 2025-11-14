<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController; 
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Auth\GoogleAuthController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

    Route::middleware('auth')->group(function () {

    Route::get('/icons',function(){
        return Inertia::render('AdminPage/Icons');
    });

    Route::get('/my-account',function(){
        return Inertia::render('CustomerSupportPage/MyAccount');
    });


    Route::get('/ourcart', [CartItemController::class, 'index'])->name('ourcart.index');
    Route::post('/ourcart', [CartItemController::class, 'store'])->name('ourcart.store');
    Route::put('/ourcart/{id}', [CartItemController::class, 'update'])->name('ourcart.update');
    Route::delete('/ourcart/{id}', [CartItemController::class, 'destroy'])->name('ourcart.destroy');


    Route::get('/ourwishlist', [WishlistController::class, 'index'])->name('ourwishlist.index');
    Route::post('/ourwishlist', [WishlistController::class, 'store'])->name('ourwishlist.store');
    Route::put('/ourwishlist/{id}', [WishlistController::class, 'update'])->name('ourwishlist.update');
    Route::delete('/ourwishlist/{id}', [WishlistController::class, 'destroy'])->name('ourwishlist.destroy');

    Route::get('/ourorder', [OrderProductController::class, 'index'])->name('ourorder.index');
    Route::post('/ourorder', [OrderProductController::class, 'store'])->name('ourorder.store');
    Route::put('/ourorder/{id}', [OrderProductController::class, 'update'])->name('ourorder.update');
    Route::delete('/ourorder/{id}', [OrderProductController::class, 'destroy'])->name('ourorder.destroy');


    // user for Update
    Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
    Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');
    Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');
    // Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
    Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');

    Route::get('/payment/success',function(){
        return Inertia::render('ShoppingPages/PaymentSuccess'); // Or whatever your actual component name is
    });


    Route::get('/payment/failure',function(){
        return Inertia::render('ShoppingPages/PaymentFailure'); // Or whatever your actual component name is
    });

    Route::post('/ourmessage', [MessageController::class, 'store'])->name('ourmessage.store');
});


    // Super Admin only routes
    Route::middleware(['auth', 'role:super admin'])->group(function() {
    
      // Dashboard

        Route::get('/dashboard',function(){
             return Inertia::render('SuperAdminPage/Dashboard');
        });

        // Home
        Route::get('/home',function(){
             return Inertia::render('SuperAdminPage/Home');
        });
    
        Route::post('/ourhome', [HomeController::class, 'store'])->name('ourhome.store');
        Route::post('/ourhome/{id}', [HomeController::class, 'update'])->name('ourhome.update'); 
        Route::delete('/ourhome/{id}', [HomeController::class, 'destroy'])->name('ourhome.destroy');

        Route::get('/activity-log', function(){
            return Inertia::render('SuperAdminPage/ActivityLogs');
        });

        Route::get('/ourlogs', [ActivityLogsController::class, 'index'])->name('ourlogs.index');  

        Route::get('/testimonials', function(){
             return Inertia::render('SuperAdminPage/Testimonials');
        });
    
        // Route::get('/ourreview', [TestimonialController::class, 'index'])->name('ourreview.index');
        Route::post('/ourreview', [TestimonialController::class, 'store'])->name('ourreview.store');
        Route::put('/ourreview/{id}', [TestimonialController::class, 'update'])->name('ourreview.update');
        Route::delete('/ourreview/{id}', [TestimonialController::class, 'destroy'])->name('ourreview.destroy');

        Route::get('/user-management', function(){
            return Inertia::render('SuperAdminPage/UserManagement');
        });

        Route::get('/order-products', function(){
            return Inertia::render('SuperAdminPage/OrderProducts');
        });
    
        // Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');
        // Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');
        // // Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
        // Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');

        Route::get('/message', function(){
            return Inertia::render('SuperAdminPage/Message');
        });


        Route::get('/messages', function(){
          return Inertia::render('SuperAdminPage/AdminMessage');
        });


        Route::get('/ourmessage', [MessageController::class, 'index'])->name('ourmessage.index');
        // Route::post('/ourmessage', [MessageController::class, 'store'])->name('ourmessage.store');
        Route::put('/ourmessage/{id}', [MessageController::class, 'update'])->name('ourmessage.update');
        Route::delete('/ourmessage/{id}', [MessageController::class, 'destroy'])->name('ourmessage.destroy');
        Route::post('/ourmessage/{id}/approve', [MessageController::class, 'approve'])->name('ourmessage.approve');
        Route::post('/ourmessage/{id}/reject', [MessageController::class, 'reject'])->name('ourmessage.reject');  

});



    // Super Admin and Admin Route
    Route::middleware(['auth', 'role:super admin|admin'])->group(function() {

        // Category
        Route::get('/categories',function(){
            return Inertia::render('AdminPage/Category');
        });

       
        Route::post('/ourcategory', [CategoryController::class, 'store'])->name('ourcategory.store');     
        Route::put('/ourcategory/{id}', [CategoryController::class, 'update'])->name('ourcategory.update'); 
        Route::delete('/ourcategory/{id}', [CategoryController::class, 'destroy'])->name('ourcategory.destroy');
        Route::get('categorywithsubcategory',[CategoryController::class,'indexWithSubCategory'])->name('categorywithsubcategory.indexWithSubCategory');

        // Sub Category
        Route::get('/sub_category',function(){
            return Inertia::render('AdminPage/SubCategory');
        });

        Route::get('/subcategory', [SubCategoryController::class, 'index'])->name('subcategory.index');      
        Route::post('/subcategory', [SubCategoryController::class, 'store'])->name('subcategory.store');     
        Route::put('/subcategory/{id}', [SubCategoryController::class, 'update'])->name('subcategory.update'); 
        Route::delete('/subcategory/{id}', [SubCategoryController::class, 'destroy'])->name('subcategory.destroy');

 
        // Products
         Route::get('/products',function(){
            return Inertia::render('AdminPage/Products');
        });
         
        Route::post('/ourproducts', [ProductController::class, 'store'])->name('ourproducts.store'); 
        Route::get('/ourproducts/{id}', [ProductController::class, 'show'])->name('ourproducts.show');    
        Route::put('/ourproducts/{id}', [ProductController::class, 'update'])->name('ourproducts.update'); 
        Route::delete('/ourproducts/{id}', [ProductController::class, 'destroy'])->name('ourproducts.destroy');
        Route::post('/ourproducts/{id}/reviews', [ProductController::class, 'addReview'])->name('ourproducts.addReview');

        // Blogs
        Route::get('/blogs',function(){
            return Inertia::render('AdminPage/Blog');
        });
    
        // Route::get('/ourblog', [BlogController::class, 'index'])->name('ourblog.index');         
        Route::post('/ourblog', [BlogController::class, 'store'])->name('ourblog.store');         
        Route::get('/ourblog/{id}', [BlogController::class, 'show'])->name('ourblog.show');     
        Route::put('/ourblog/{id}', [BlogController::class, 'update'])->name('ourblog.update');    
        Route::delete('/ourblog/{id}', [BlogController::class, 'destroy'])->name('ourblog.destroy'); 


        Route::get('/admin-setting',function(){
            return Inertia::render('AdminPage/AdminSetting');
        });
    });


    // Admin Route only routes
    Route::middleware(['auth', 'role:admin'])->group(function() {

        Route::get('/admin-dashboard',function(){
            return Inertia::render('AdminPage/AdminDashboard');
        });
    });



    // Customer Route only routes

    Route::middleware(['auth', 'role:customer'])->group(function() {

        Route::get('/customer-dashboard',function(){
             return Inertia::render('CustomerPage/CustomerDashboard');
        });

        Route::get('/product-cart',function(){
            return Inertia::render('CustomerPage/ProductCart');
        });

        Route::get('/customer-setting',function(){
            return Inertia::render('CustomerPage/CustomerSetting');
        });

        Route::get('/customer-products',function(){
             return Inertia::render('CustomerPage/UserProducts');
        });

        Route::get('/customer-home',function(){
             return Inertia::render('CustomerPage/CustomerHome');
         });

    });

    // Home Page Routes for all users
    Route::get('/ourhome', [HomeController::class, 'index'])->name('ourhome.index');

    // Category Page Routes for all users

    Route::get('/ourcategory', [CategoryController::class, 'index'])->name('ourcategory.index');  

    // Sub Category Page Routes for all users

    Route::get('/ourproducts', [ProductController::class, 'index'])->name('ourproducts.index'); 

    // Blog Page Routes for all users
    Route::get('/ourblog', [BlogController::class, 'index'])->name('ourblog.index'); 

    // Testimonial Page Routes for all users

    Route::get('/ourreview', [TestimonialController::class, 'index'])->name('ourreview.index');




    // Home Page Routes

    Route::get('/',function(){
        return Inertia::render('HomePages/Home');
    });

    // Main Pages Routes

    Route::get('/products/{slug}',function(){
     return Inertia::render('MainPages/ProductsPage');
    });

    Route::get('/category',function(){
        return Inertia::render('MainPages/Categories');
    });

    Route::get('/gallery',function(){
        return Inertia::render('MainPages/GalleryPage');
    });

    Route::get('/contact-us',function(){
        return Inertia::render('MainPages/ContactUs');
    });

    Route::get('/privacy-policy',function(){
        return Inertia::render('MainPages/PrivacyPolicy');
    });

    Route::get('/all-products',function(){
        return Inertia::render('MainPages/AllProductsPage');
    });


    Route::get('/wishlist',function(){
        return Inertia::render('MainPages/WishlistPage');
    });

    Route::get('/blog',function(){
         return Inertia::render('MainPages/BlogPage');
    });

    // Details Pages Routes
    Route::get('/blog-details/{slug}',function(){
        return Inertia::render('DetailsPage/BlogDetails');
    });


    // Shopping Pages Routes
    Route::get('/cart',function(){
        return Inertia::render('ShoppingPages/CartPage');
    });


    Route::get('/check-out',function(){
         return Inertia::render('ShoppingPages/CheckOutPage');
    });

    // Customer Support Pages and Policies
    Route::get('/help-support',function(){
        return Inertia::render('CustomerSupportPage/HelpandSupport');
    });

    Route::get('/faq',function(){
        return Inertia::render('CustomerSupportPage/FAQPage');
    });


     Route::get('/privacy-security',function(){
        return Inertia::render('CustomerSupportPage/PrivacyandSecurity');
    });


    Route::get('/return-refund',function(){
        return Inertia::render('CustomerSupportPage/ReturnAndRefund');
    });


    Route::get('/cookie-policy',function(){
        return Inertia::render('CustomerSupportPage/CookiePolicy');
    });


    Route::get('/privacy-policy',function(){
        return Inertia::render('CustomerSupportPage/PrivacyPolicy');
    });


    Route::get('/terms-and-condition',function(){
        return Inertia::render('CustomerSupportPage/TermsandConditions');
    });

    Route::get('/about-us',function(){
        return Inertia::render('CustomerSupportPage/AboutUs');
    });


    // For The Google Authentication Part This is for redirecting to google auth page
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.login');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);


require __DIR__.'/auth.php';