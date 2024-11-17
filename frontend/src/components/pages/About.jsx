import { Link } from 'react-router-dom'
import devImg from '/dev.jpg'
import teamImg from '/team.jpg'
import yogendraImg from '/yogendra.jpg'
import tarangImg from '/tarang.jpg'

export default function AboutUs() {
    return (
        <div className="min-h-screen flex flex-col w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 bg-gray-50 mb-2">
            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">About Servico</h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-10">Connecting you with the best local services since 2024.</p>
                            <Link to="/" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 to-purple-100 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center transform hover:scale-105 transition-all duration-300">
                            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                                <h2 className="text-3xl font-bold mb-6 text-indigo-900">Our Mission</h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    At Servico, we're committed to revolutionizing the way people connect with local services.
                                    Our mission is to create a seamless, trustworthy platform that empowers both service providers and
                                    customers. We believe in fostering community growth, supporting local businesses, and ensuring
                                    every interaction leads to exceptional service experiences.
                                </p>
                            </div>
                            <div className="md:w-1/2 relative">
                                <img
                                    src={teamImg}
                                    alt="Team collaboration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-900">Why Choose Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Easy to Use",
                                    description: "Find the services you need with just a few clicks. Our intuitive platform makes searching and booking a breeze.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Verified Professionals",
                                    description: "All service providers are thoroughly vetted and reviewed. Trust and quality are our top priorities.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "24/7 Support",
                                    description: "Our dedicated team is always here to assist you. Get help anytime, anywhere.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-indigo-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-900">Meet Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { name: "Tarang Bharaiya", position: "Frontend and UI/UX", img: tarangImg },
                                { name: "Yogendra Chahuan", position: "Frontend and Database Admin", img: yogendraImg },
                                { name: "Dev Patel", position: "Backend", img: devImg },
                            ].map((member, index) => (
                                <div key={index} className="text-center group">
                                    <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full">
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="transition-transform duration-300 transform group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2 text-indigo-900">{member.name}</h3>
                                    <p className="text-indigo-600 font-medium">{member.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div className="container mx-auto">
                        <h2 className="text-4xl text-white font-bold mb-12 text-center">What Our Customers Say</h2>
                        <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 shadow-xl">
                            <div className="flex items-center mb-6">
                                
                                <div>
                                    <p className="font-semibold text-xl text-white">Yash Patel</p>
                                    <p className="text-indigo-200">Happy Customer</p>
                                </div>
                            </div>
                            <p className="text-2xl text-white italic mb-6">"Servico made it so easy to find a reliable plumber in my area. I was impressed by the quality of service and how quickly everything was arranged!"</p>
                            <div className="flex justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star}  className="h-6 w-6  text-yellow-400 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4">
                    <div className="container mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-8 text-indigo-900">Ready to Find Your Perfect Service Provider?</h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers who have found reliable local services through our platform.</p>
                        <Link to="/" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                            Get Started Now
                        </Link>
                    </div>
                </section>


            </main>
        </div>
    )
}