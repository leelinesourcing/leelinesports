v1:
Please generate a landscaping website with only a home page and a landing page for landscaping services toronto. Please use the attached design from Dribbble.


v2:
Please add the following things to optimze the page convertion:
1. A 3x3 section for video testimonials
4. Have a CTA button on every major section of the page on desktop, and on mobile, please make sure there's only one CTA and it's fixed at the bottom of the page, scrolling as the user goes down
5. Add a quote form at the bottom of the page: first name, last name, email, phone
6. Add 9 written testimonials in a 3x3 section as well
7. Add a portfolio section to the website
8. Add a FAQ section address the biggest objection handles for my industry
9. Add a clickable call link to the page for (123) 456-7890
8. Add 2 case studies on before/after transformations from clients
9. Add 9 sample brand logos from businesses we've worked with
10. I want to create a trustpilot review widget with a 4.7 star rating over 67 reviews we've received
If you don't have things (like the video testimonials, just put placeholders for now)

optimize the website speed

Please optimize this page for desktop, tablet and mobile. Also here's my google lighthouse report. Can you please make sure the page speed is blazing fast so we don't lose people to bounce rate.

v4:
Can you please turn this into a skill where I can create landing pages on demand with all the info we've talked about. I want it to copy this landing page, be optimized for load speed, and desktop, tablet and mobile devices. I will enter in a [city], [service], and you'll create a page for that. Please write like you're a copywriter aimed at converting 20% of web visitors into leads.

v5: 
Can we add:
1. A /thank-you page to our website, that we redirect users to after they submit the quote form (conversion value). Please add my calendar to this page so someone can book a call <insert calendar embed link here>
2. Add PostHog to our site to track both the home page and /landscaping-toronto conversions
3. I want to add a heat mapping analysis of our site from PostHog, so I can understand what's going on.
Conversion = form submissions / web visitors
npx -y @posthog/wizard@latest

v6:
I need to add tracking to these pages from PostHog. Here's the control is the home page and the test is the /v2 page:
Control:
Implement your experiment in code
if (posthog.getFeatureFlag('ab-testing') === 'control') {
    // Do something differently for this user
} else {
    // It's a good idea to let control variant always be the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break your app.
}
Test that it works
posthog.featureFlags.overrideFeatureFlags({ flags: {'ab-testing': 'control'} })
Test:
Implement your experiment in code
if (posthog.getFeatureFlag('ab-testing') === 'test') {
    // Do something differently for this user
} else {
    // It's a good idea to let control variant always be the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break your app.
}
Test that it works
posthog.featureFlags.overrideFeatureFlags({ flags: {'ab-testing': 'test'} })

v6: Deploy site to Github please

v7: Send a form data to this webhook on submit: https://services.leadconnectorhq.com/hooks/t9Oq9bMWtOjZsfpDCFVa/webhook-trigger/8c1a5dc7-4d18-473a-bc6c-84a882452e48