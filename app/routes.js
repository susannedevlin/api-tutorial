//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require("govuk-prototype-kit");
const router = govukPrototypeKit.requests.setupRouter();
const Anthropic = require("@anthropic-ai/sdk");

// Add your routes here
// Translation route
router.post("/translate", async function (req, res) {
  const textToTranslate = req.body.textToTranslate;

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Translate the following text to English. Only provide the translation, nothing else:\n\n${textToTranslate}`,
        },
      ],
    });

    // Store the translation in session data
    req.session.data.translation = message.content[0].text;

    // Redirect to results page
    res.render("translate");
  } catch (error) {
    console.error("Translation error:", error);
    res.send("Sorry, there was an error translating your text.");
  }
});
