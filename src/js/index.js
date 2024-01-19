/**
 * The main script file of the application.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

try {
  const registration = await navigator.serviceWorker.register('./sw.js')
  console.log('ServiceWorker registration successful with scope: ', registration.scope)
} catch (error) {
  console.log('ServiceWorker registration failed: ', error)
}
