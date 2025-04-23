# Eventify - Event Management Platform

Eventify is a comprehensive event management platform that allows users to discover, book, and manage events. It includes both a web interface and a mobile application (iOS).

## Project Structure

The app is organized into the following main components:

### Models
- User model for authentication
- Event model with location, categories, and ticket types
- UserTicket model for purchased tickets

### ViewModels
- Authentication and user management
- Event discovery and filtering
- Ticket selection and checkout
- Event management for organizers

### Views
- Authentication views
- Event discovery and search
- Ticket booking flow
- User dashboard
- Event management for organizers

## Deployment Instructions

### Prerequisites
- Xcode 14.0 or later
- iOS 16.0 or later for deployment target
- macOS for development

### Steps to Deploy

1. **Create a new Xcode project**:
   - Open Xcode
   - Create a new iOS project using the "App" template
   - Choose "SwiftUI" for the interface
   - Name the project "Eventify"
   - Select your team for signing

2. **Import the project files**:
   - Delete the default ContentView.swift file
   - Drag all the files from this repository into your Xcode project
   - Make sure to select "Copy items if needed" and "Create groups"
   - Organize the files into groups that match the directory structure

3. **Configure the project**:
   - Update the Info.plist if needed for any permissions
   - Configure signing capabilities in the project settings
   - Set the deployment target to iOS 16.0 or later

4. **Build and run**:
   - Select a simulator or connected device
   - Build and run the application
   - Test the core functionality

5. **For App Store deployment**:
   - Create app icons and launch screens
   - Complete App Store Connect setup
   - Archive the app and upload to App Store Connect

## Testing the App

The app includes mock data for testing all features without requiring a backend. You can:

- Sign in with any email/password combination
- Browse mock events
- Select tickets and complete checkout
- View tickets in the user dashboard
- Create and manage events as an organizer

## Next Steps for Production

For a production-ready app, you would need to:

1. Implement a real backend API
2. Set up user authentication with Firebase or another auth provider
3. Implement real payment processing
4. Add analytics and crash reporting
5. Enhance security for ticket validation

## License

This project is for demonstration purposes only.
