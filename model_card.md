
# Model Card — [NutriCheck]

**Scenario:** [This is an Evidence-Based Nutrition Claim Fact-Checking System using AI and Scientific Literature]
**Authors:** [Grace]
**Date:** [May 5, 2026.]

---

## 1. Model Details

> What model or API is being used? Who built it? What version? What type of
> model — classification, prediction, generation, optimization? When was it
> developed?

[The NutriCheck system is an AI-powered fact-checking tool that combines information retrieval and large language model (LLM) analysis to evaluate nutrition-related claims. It integrates the PubMed API to retrieve peer-reviewed scientific literature and uses the Llama 3 70B model via the Groq API to analyze and classify claims.

The system performs a classification task, where outputs are categorized as TRUE, MISLEADING, or FALSE, along with a confidence level and supporting evidence.

It was developed as part of an academic project using existing APIs and newly built dataset using existing claims from instagram. A specific model version is not controlled by the developer, as it depends on the version provided through the Groq API, indicating that this is an application-layer AI system rather than a fully custom-trained model.]

---

## 2. Intended Use

> What is the primary task? Who are the intended users? What decisions does
> the system inform? In what context is it deployed?

[This system is meant to function as a nutrition claim verification tool, specifically designed to help users identify whether commonly encountered diet and health claims are scientifically accurate. The primary users of the tool are students, educators, and general consumers who are exposed to nutrition misinformation, particularly through online platforms and social media.

The system informs decisions related to: Evaluating the credibility of nutrition claims, understanding the strength of scientific evidence, and promoting evidence-based awareness of dietary information.

It is deployed as a web-based application that users can access through a browser, where they input claims and receive AI-generated verdicts supported by scientific literature.]

---

## 3. Out-of-Scope Uses

> What should this system NOT be used for? What populations, settings, or
> decisions are outside its design? What misuses are foreseeable?

[It would be inappropriate for anyone to use this tool to make medical or clinical decisions, such as diagnosing or using it to check for scientific backing for very weird claims that are not even associated with nutrition. It would be inappropriate to use this system as a checker for medicines or pharmaceutical products.That would mean that the tool is being used in the wrong context for the wrong purpose.
]

---

## 4. Training Data

> What data was used to build or train this model? How was it collected? What
> populations, geographies, languages, and time periods does it cover? What
> is missing?

[The system does not rely on traditional model training data but instead uses real-time data retrieval from the PubMed database, which contains over 35 million biomedical research articles. The analysis is performed using a pre-trained large language model (Llama 3 70B), which has been trained on a mixture of publicly available text and human-generated content from social media.

The PubMed data primarily represents peer-reviewed scientific research, largely in English, and reflects global contributions but may be biased toward studies conducted in Western countries.

What is missing includes full-text access to articles (as the system relies mainly on abstracts), non-English research, and unpublished or non-peer-reviewed data. This can limit the comprehensiveness of the analysis. Also, this tool is supposed to be able to access Cochrane but currently there is limited access to a live api for cochrane reviews.]

---

## 5. Evaluation Data & Metrics

> How was performance measured? What metrics were used — accuracy, sensitivity,
> specificity, F1, AUC, RMSE? On what test set? Is it independent from the
> training data?

[No formal evaluation framework is described in the system implementation. Current assessment relies on manual testing using sample claims and observing whether the generated verdicts align with known scientific consensus.

Recommended evaluation metrics include:
Classification accuracy (TRUE / MISLEADING / FALSE)
Consistency of outputs across repeated inputs
Relevance of retrieved scientific papers
Agreement with expert evaluation (e.g., dietitians or nutrition researchers)

Also, a structured and independent test dataset of labeled nutrition claims should be developed to properly evaluate the system’s performance.]

---

## 6. Quantitative Analysis

> Performance broken down by relevant subgroups — age, sex, race/ethnicity,
> geography, income, language. Does the model perform differently across
> these groups? Where are the gaps?

[No subgroup-based performance analysis is reported. A proper evaluation should assess performance across:

Different nutrition topics (e.g., weight loss, cardiovascular health, metabolism)
Complex vs simple claims
Claims with strong vs limited scientific evidence
Language complexity of user input

Most importantly, potential disparities may arise if: Certain topics are under-researched in the literature, the model struggles with ambiguous or nuanced claims, or the retrieved evidence is insufficient to support a confident classification.]

---

## 7. Ethical Considerations

> Bias risks, informed consent, privacy, potential harms, equity implications.
> Does this system reproduce or amplify existing disparities? Who bears the
> consequences when it fails?

[In terms of bias and equity, the system may reflect biases present in published scientific literature, such as overrepresentation of Western populations or positive-result publication bias. Additionally, the LLM may introduce interpretive bias when summarizing or evaluating evidence.

For privacy and data usage, the system does not collect sensitive personal health data, and user inputs are limited to general claims. However, any stored interaction data (e.g., browser history via localStorage) should still be handled responsibly.

For likely potential harms, incorrect or oversimplified classifications could misinform users, especially if they rely heavily on the tool without consulting professionals. Over-reliance on the system may reduce critical thinking or lead users to misinterpret nuanced scientific findings.

Failures primarily impact general users seeking health information, and responsibility lies with developers to ensure transparency, provide disclaimers, and continuously improve system accuracy.]

---

## 8. Limitations & Caveats

> Known failure modes, edge cases, what the model does not capture. Conditions
> where it performs poorly. Assumptions baked into the design that may not
> hold in all deployment contexts.

[One major limitation of the tool is that it relies on abstracts rather than full-text scientific articles, which may omit important details or context. If the retrieved studies are not highly relevant, the analysis produced will be weak or misleading.

Also, the system may oversimplify complex scientific topics into one of three categories (TRUE, MISLEADING, FALSE), which does not always capture the full nuance of nutrition science.

Another limitation the LLM used is unable to deeply synthesize the information and make sense out of the abstracts that it finds online.]

---

## 9. Human Oversight

> Who reviews outputs before action is taken? Human in the loop, on the loop,
> or out of the loop? What is the escalation path when the model is wrong?
> Can it act autonomously — and should it?

[Another limitation of this tool is that it lacks human oversight. There is no domain expert, such as a dietitian or nutrition researcher, serving as a human in the loop to validate the outputs before they are presented to users.

This tool should not be allowed to operate autonomously in high-stakes contexts, and users should be encouraged to verify results with credible sources or professionals.

Recommendation:

Incorporate expert review mechanisms (human-in-the-loop) - before an output gets to a user, it must go through a trained dietitian to make sure that the tool produces the right information that can be informational for the user
Allow user feedback for incorrect or misleading outputs
Provide clear disclaimers and guidance for interpretation
Create escalation pathways for ambiguous or conflicting results]

---

## 10. Temporal Validity

> When does this model need retraining or re-evaluation? What triggers a
> review — new data, policy change, population shift, outbreak? How does
> performance degrade over time?

[The system’s performance is likely to degrade over time due to changes in:

Scientific consensus as new research is published
Updates in dietary guidelines and public health recommendations
Changes in the underlying LLM behavior or API updates
Variations in PubMed indexing and search results

Regular re-evaluation is necessary to ensure that the system remains accurate and aligned with current scientific evidence. Updates should include refining search strategies, improving prompt design, and incorporating newer models where appropriate.]
