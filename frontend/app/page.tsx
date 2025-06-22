import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">CPS Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#courses" className="text-gray-500 hover:text-gray-900">
                Courses
              </Link>
              <Link href="#about" className="text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link href="#contact" className="text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master New Skills with
              <span className="text-blue-600"> CPS Academy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of learners in our comprehensive course platform. Learn from industry experts and advance
              your career with our role-based learning system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CPS Academy?</h2>
            <p className="text-xl text-gray-600">
              Our platform offers a comprehensive learning experience tailored to your role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Expert-Led Courses</CardTitle>
                <CardDescription>Learn from industry professionals with real-world experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access high-quality content created by experts in their respective fields
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Role-Based Learning</CardTitle>
                <CardDescription>Customized learning paths based on your role and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Student, Instructor, or Admin - each role gets a tailored experience</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Certification</CardTitle>
                <CardDescription>Earn certificates upon course completion</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Validate your skills with industry-recognized certifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">Join CPS Academy today and unlock your potential</p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold">CPS Academy</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education and role-based learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Mobile Development
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    DevOps
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CPS Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
