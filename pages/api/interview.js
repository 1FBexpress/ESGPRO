// pages/api/interview.js - placeholder
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  const answers = req.body;
  // Deterministic rule example
  let urgency = 'low';
  if(answers.tender_days && Number(answers.tender_days) <= 30) urgency = 'high';
  // Simple scoring
  const score = Math.min(100, (answers.size || 1)*10 + (urgency==='high'?30:0));
  // Recommend sample SKU based on size
  let sku = 'ESG-1';
  if(answers.size > 10 && answers.size <=25) sku='ESG-2';
  if(answers.size >25 && answers.size <=100) sku='ESG-3';
  if(answers.size >100) sku='ESG-4';
  const response = {
    action: (score>70? 'BOOK_FREE_CONSULT' : (score>40? 'BUY_50_ASSESSMENT':'NURTURE')),
    urgency, score,
    lead_brief: `Auto-brief: ${answers.name || 'Unknown'} from ${answers.company || 'Unknown company'} (size ${answers.size || 'N/A'})`,
    focus_points: ['Point 1','Point 2','Point 3'],
    opening_questions: ['When is your tender?','Do you have energy data?'],
    pricing_recommendation: { tier: 'Small (1-25)', sku_recs: [sku] }
  };
  // In production: insert lead into DB and notify contacts
  return res.status(200).json(response);
}
