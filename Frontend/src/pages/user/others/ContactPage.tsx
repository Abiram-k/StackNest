"use client"

import { useState } from "react"
import { Bell, Heart, User } from 'lucide-react'
import { Link } from "react-router-dom"


interface FormData {
  name: string
  email: string
  type: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({ name: "", email: "", type: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/placeholder.svg"
                  alt="Brand Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-8">
                {['Home', 'About', 'Daily Challenge', 'Highlights', 'Contact us'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className={`text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium ${
                      item === 'Contact us' ? 'font-semibold' : ''
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>
              <button className="text-gray-700 hover:text-red-500">
                <Heart className="h-6 w-6" />
              </button>
              <button className="text-gray-700 hover:text-gray-900">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fuel Your Brand's Goals with{" "}
            <span className="text-blue-600">Beyond</span>
          </h1>
          <p className="text-gray-600">
            You will get a response within 24 hours. We will explain in details how we can help you fuel and grow your brand within the stated budget.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xl font-medium text-gray-900 mb-3">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full border-0 border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-900 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full border-0 border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Type Input */}
            <div>
              <label htmlFor="type" className="block text-xl font-medium text-gray-900 mb-3">
                Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="block w-full border-0 border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-xl font-medium text-gray-900 mb-3">
                Message ...
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="block w-full border-0 border-b border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
